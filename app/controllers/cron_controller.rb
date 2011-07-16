class CronController < ActionController::Base

  def parse_youporn_dot_com
    #Парсинг главной страницы
    require 'nokogiri'
    require 'open-uri'

    # Открываем сайт
    site = 'http://www.youporn.com'
    cookie = {"Cookie"=>"age_check=1"}
    doc = Nokogiri::HTML(open(site, cookie))

    ####
    #Удаляем раздел что сейас смотрят
    doc.css("#vbwn").remove()

    # проходимся по каждому видео
    video_to_save = {}
    item_index = 0
    items = doc.css('#video-listing ul.clearfix li')
    items.each do |item|
      #Достаем превьюшки
      video_thumbnails = {}
      video_base_image = item.css('img').first.attribute('src')
      video_count_image = item.css('img').first.attribute('num').to_s
      video_multiple_thumbnail_url = item.css('img').first.attribute('multiple_thumbnail_url')
      if video_multiple_thumbnail_url
        for i in 1..Integer(video_count_image)
          video_thumbnails[i-1] = video_multiple_thumbnail_url.to_s + '/' + i.to_s + '.jpg'
        end
      else
        result = video_base_image.to_s.match(/screenshot\/(\d+)_(large|extra_large)\.jpg$/)
        video_id    = result[1];
				size        = result[2];
        pos = video_base_image.to_s =~ /screenshot\/(\d+)_(large|extra_large)\.jpg$/
				prepend_url = video_base_image.to_s[0..pos-1]
        for i in 1..Integer(video_count_image)
          video_thumbnails[i-1] = prepend_url.to_s + 'screenshot_multiple/' + video_id.to_s + '/' + video_id.to_s + '_multiple_' + i.to_s + '_' + size.to_s + '.jpg'
        end
      end

      video_url = item.css('h1 a').first.attribute('href').to_s
      video_title = item.css('h1 a').first.text.strip
      video_duration = item.css('div.duration_views h2').first.text.strip

      #достаем подробную инфу о видео
      doc = Nokogiri::HTML(open(site+video_url, cookie))
      #ссылки для скачивания
      video_downloads = {}
      downloads = doc.css('#download ul li')
      downloads.each do |download, index|
        download_link = download.css('a').attribute('href').to_s
        download_name = download.css('p').text.strip
        video_downloads[index] = {
            'name' => download_name,
            'url' => download_link
        }
      end
      #детали видео
      video_tags = {}
      video_categories = {}
      details = doc.css('#details ul li')
      details.each do |detail, index|
        detail_split = detail.text.strip.split(':')
        case detail_split[0]
          when 'Tags' ;
            video_tags = detail_split[1].to_s.split(',').collect(&:strip)
          when 'Categories' ;
            video_categories = detail_split[1].to_s.split(',').collect(&:strip)
        end
      end

      video_to_save[item_index] = {
        'name' => video_title,
        'images' => video_thumbnails,
        'url' => site + video_url,
        'duration' => video_duration,
        'view' => 0,
        'rating' => 0,
        'tags' => video_tags,
        'categories' => video_categories,
        'downloads' => video_downloads
      }
      item_index+=1
    end

    @test = video_to_save.to_a
  end

end