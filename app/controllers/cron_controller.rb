class CronController < ActionController::Base

	def index

	end

	def parse_youporn_dot_com
		#Парсинг главной страницы
		require 'nokogiri'
		require 'open-uri'

			# Открываем сайт
		site = 'http://www.youporn.com'
		if params[:page].present?
			site_param = '?page=' + params[:page].to_s
		else
			site_param = '?page=1'
		end
		cookie = {"Cookie"=>"age_check=1"}
		doc = Nokogiri::HTML(open(site+site_param, cookie))

			####
			#Удаляем раздел что сейас смотрят
		doc.css("#vbwn").remove()

			# проходимся по каждому видео
		items = doc.css('#video-listing ul.clearfix li')
		items.each do |item|

			video_title = item.css('h1 a').first.text.strip
			video_url = item.css('h1 a').first.attribute('href').to_s
			video_duration = item.css('div.duration_views h2').first.text.strip

				#достаем подробную инфу о видео
			doc = Nokogiri::HTML(open(site+video_url, cookie))
				#прямая ссылка на видео
			player = doc.css('script').to_s
			player_scan = player.scan(/so\.addVariable\(\'file\', encodeURIComponent\(\'(.*)\'\)\);/)
			if (player_scan[0]==nil)
				next
			end
			video_link = player_scan[0][0].to_s
			is_exists = Video.count(:xml_url => video_link)
			if is_exists>0
				next
			end
			doc_link = Nokogiri::HTML(open(video_link, cookie)).css('location').text
			video_file_link = doc_link.to_s

			video = Video.create(
							:_id => Incrementor[:video].inc,
							:name => video_title,
							:view => 0,
							:rating => 0,
							:duration => video_duration,
							:url => site+video_url,
							:xml_url => video_link
			)

				#ссылки для скачивания
			video_downloads = []
			downloads = doc.css('#download ul li')
			i = 0
			downloads.each do |download|
				download_link = download.css('a').attribute('href').to_s
				download_name = download.css('p').text.strip
				video_downloads[i] = Download.new(
								:name => download_name.sub(/\n/, '').to_s,
								:url => download_link
				)
				i+=1
			end
			if video_downloads
				video.downloads = video_downloads
			end
				#video.downloads << video_downloads
				#Достаем превьюшки
			video_thumbnails = []
			video_base_image = item.css('img').first.attribute('src')
			video_count_image = item.css('img').first.attribute('num').to_s
			video_multiple_thumbnail_url = item.css('img').first.attribute('multiple_thumbnail_url')
			if video_multiple_thumbnail_url
				for i in 1..Integer(video_count_image)
					video_thumbnails[i-1] = video_multiple_thumbnail_url.to_s + '/' + i.to_s + '.jpg'
				end
			else
				result = video_base_image.to_s.match(/screenshot\/(\d+)_(large|extra_large)\.jpg$/)
				video_id = result[1]
				size = result[2]
				pos = video_base_image.to_s =~ /screenshot\/(\d+)_(large|extra_large)\.jpg$/
				prepend_url = video_base_image.to_s[0..pos-1]
				for i in 1..Integer(video_count_image)
					video_thumbnails[i-1] = prepend_url.to_s + 'screenshot_multiple/' + video_id.to_s + '/' + video_id.to_s + '_multiple_' + i.to_s + '_' + size.to_s + '.jpg'
				end
			end
			video.images = video_thumbnails.to_a

				#детали видео
			video_tags = []
			video_categories = []
			details = doc.css('#details ul li')
			details.each do |detail, index|
				detail_split = detail.text.strip.split(':')
				case detail_split[0].strip.to_s
					when 'Categories' then
						categories = detail_split[1].to_s.split(',').collect(&:strip)
						i = 0
						categories.each do |category|
							get_category = Category.where(:name => category.to_s)
							if (get_category.count>0)
								video.categorys << get_category.first
							else
								new_category_id = Integer(Incrementor[:category].inc)
								new_category = Category.create(:_id => new_category_id, :name => category.to_s)
								video.categorys << new_category
							end
							i+=1
						end
					when 'Tags' then
						tags = detail_split[1].to_s.split(',').collect(&:strip)
						i = 0
						tags.each do |tag|
							get_tag = Tag.where(:name => tag.to_s)
							if (get_tag.count==0)
								Tag.create(:_id => Integer(Incrementor[:tag].inc), :name=>tag.to_s)
							end
							video.tags[i] = tag.to_s
							i+=1
						end
					when 'Date' then
						video.date = DateTime.strptime(detail_split[1].strip, "%B %e, %Y")
				end
			end
			#Пересчитываем счетчики категорий
			Category.all.each do |item|
				if item._id==0
						item.videos = Video.where(:category_ids => {'$size'=>0}).count
					else
						item.videos = Video.where(:category_ids => [item._id]).count
				end
				item.save
			end
			video.save
			@result = 'ok'
		end
	end

	def reparse_youporn_dot_com
		require 'nokogiri'
		require 'open-uri'
		cookie = {"Cookie"=>"age_check=1"}
		#Находим видео без категорий
		videos = Video.where(:category_ids => {'$size'=>0}).all
		videos.each do |video|
			is_change = 0
			url = video.url.to_s
			#достаем подробную инфу о видео
			doc = Nokogiri::HTML(open(url, cookie))

				#детали видео
			video_tags = []
			video_categories = []
			details = doc.css('#details ul li')
			details.each do |detail, index|
				detail_split = detail.text.strip.split(':')
				case detail_split[0].strip.to_s
					when 'Categories' then
						categories = detail_split[1].to_s.split(',').collect(&:strip)
						i = 0
						categories.each do |category|
							get_category = Category.where(:name => category.to_s)
							if (get_category.count>0)
								video.categorys << get_category.first
							else
								new_category_id = Integer(Incrementor[:category].inc)
								new_category = Category.create(:_id => new_category_id, :name => category.to_s)
								video.categorys << new_category
							end
							i+=1
						end
						is_change = 1
					when 'Tags' then
						if video.tags.blank? then
							tags = detail_split[1].to_s.split(',').collect(&:strip)
							i = 0
							tags.each do |tag|
								get_tag = Tag.where(:name => tag.to_s)
								if (get_tag.count==0)
									Tag.create(:_id => Integer(Incrementor[:tag].inc), :name=>tag.to_s)
								end
								video.tags[i] = tag.to_s
								i+=1
							is_change = 1
							end
						end
				end
			end

			if is_change then
				video.save
			end
		end
	end

end