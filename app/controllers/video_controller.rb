class VideoController < ApplicationController
	layout 'konigi'
	skip_before_filter :can_view, :only => [:null_page, :enter, :exit, :logout]
	skip_before_filter :login, :only => [:null_page, :exit, :logout]

	# список видео ajax и просто html 
	def index
		if request.xhr? then
			list = Video.fields(:name, :images, :date, :duration)
			if (params[:category].present?)
				if params[:category].include?('0')
					list = list.where('$or'=>[{'category_ids'=>{'$in'=>params[:category].collect { |x| Integer(x) }}}, {'category_ids'=>{'$size'=>0}}])
				else
					list = list.where(:category_ids.in => params[:category].collect { |x| Integer(x) })
				end
			end
			if (params[:seen].present? && params[:seen] == 'true')
				list = list.where(:_id => @user.seen)
			end
			if (params[:unseen].present? && params[:unseen] == 'true')
				list = list.where(:_id.nin => @user.seen)
			end
			if (params[:clicked].present? && params[:clicked] == 'true')
				list = list.where(:_id => @user.clicked)
			end
			if (params[:unclicked].present? && params[:unclicked] == 'true')
				list = list.where(:_id.nin => @user.clicked)
			end
			@list = list.paginate(
							:order => :_id.desc,
							:per_page => 25,
							:page => params[:page]
			)
			@list.each do |video, index|
				if @user.seen.include?(video._id)
					@user.seen.push(video._id)
				end
			end
			@user.save
			#@list = params[:category].collect{|x| Integer(x)}
			respond_to do |format|
				format.html
				format.json { render :json => @list }
			end
		end
	end

	# просмотр конкретного видео через colorbox
	def view
		id = params[:id]
		video = Video.find(Integer(id))
		comments = video.comments.sort_by(&:published).reverse
		@video = video
		@comments = comments
		if @video.present?
			@title = @video.name
			if @user.clicked.include?(Integer(id))
				@user.clicked.push(Integer(id))
				@user.save
			end
		end
		respond_to do |format|
			format.html { render :layout => false }
			format.json { render :json => @video }
		end

	end

	# комментирование видео
	def comment
		if request.post? then
			id = params[:id]
			video = Video.find(Integer(id))
			if video
				result = {'result'=>nil}
				if !params[:name].blank? && !params[:message].blank? then
					published = Time.current
					message = params[:message]
					comment = Comment.new(
									:name => params[:name],
									:message => message,
									:published => published
					)
					video.comments.push(comment)
					video.save
					# сохраним НИК пользователя из комментария
					@user.nick = params[:name]
					@user.save
					result = {
									'result'=>'ok',
									'data' => {
													'name' => params[:name],
													'message' => message,
													'published' => published.strftime("%d %B, %Y %H:%M")
									}
					}
				end
				if params[:format]=='json'
					respond_to do |format|
						format.json { render :json => result }
					end
				else
					redirect_to :back
				end
			else
				if params[:format]=='json'
					respond_to do |format|
						format.json { render :json => {'result' => 'false'} }
					end
				else
					redirect_to :back
				end
			end
		end
	end

	# рекомендованое видео
	def recomend
		id = params[:id]
		page = params[:page]
		video = Video.fields(:tags).find(Integer(id))
		list = Video.where(:tags.in => video.tags)
		@list = list.paginate(
						:order => :_id.desc,
						:per_page => 6,
						:page => params[:page]
		)
		respond_to do |format|
			format.any { render :json => @list }
		end
	end

	# отметка что видео было просмотрено до конца
	def looked
		video_id = Integer(params[:id])
		if !@user.looked.include?(video_id)
			@user.looked.push(video_id)
			@user.save
		end
		render :json => true
	end

	def favorite
		result = {}
		if request.post? then
			id = params[:id]
			act = params[:act]
			video = Video.find(Integer(id))
			if video && session[:id].present? && act=='add'
				user_id = session[:id]
				user = User.find(user_id)
				if !user.favorites.include?(id)
					user.favorites.push(id)
					user.save
				end
				result = video
				result[:status] = true
			elsif session[:id].present? && act=='del'
				user_id = session[:id]
				user = User.find(user_id)
				user.favorites.delete(id)
				user.save
				result[:status] = true
			end
		end
		respond_to do |format|
			format.any { render :json => result }
		end
	end
end