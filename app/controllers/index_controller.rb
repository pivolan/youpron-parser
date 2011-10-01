class IndexController < ApplicationController
	layout 'konigi'
	skip_before_filter :can_view, :only => [:null_page, :enter, :exit, :logout]
	skip_before_filter :login, :only => [:null_page, :exit, :logout]

	def index

	end

	def video
		if request.xhr? then
			list = Video.fields(:name, :images, :date, :duration)
			if (params[:category].present?)
				if params[:category].include?('0')
						list = list.where('$or'=>[{'category_ids'=>{'$in'=>params[:category].collect{|x| Integer(x)}}}, {'category_ids'=>{'$size'=>0}}])
					else
						list = list.where(:category_ids.in => params[:category].collect{|x| Integer(x)})
				end
			end
			if(params[:seen].present? && params[:seen] == 'true')
				list = list.where(:_id => @user.seen)
			end
			if(params[:unseen].present? && params[:unseen] == 'true')
				list = list.where(:_id.nin => @user.seen)
			end
			if(params[:clicked].present? && params[:clicked] == 'true')
				list = list.where(:_id => @user.clicked)
			end
			if(params[:unclicked].present? && params[:unclicked] == 'true')
				list = list.where(:_id.nin => @user.clicked)
			end
			@list = list.paginate(
							:order => :_id.desc,
							:per_page => 25,
							:page => params[:page]
			)
			@list.each do |video, index|
				@user.seen.delete(video._id)
				@user.seen.push(video._id)
			end
			@user.save
			#@list = params[:category].collect{|x| Integer(x)}
			respond_to do |format|
				format.html
				format.json { render :json => @list }
				
			end
		end
	end

	def view
		id = params[:id]
		video = Video.find(Integer(id))
		comments = video.comments.sort_by(&:published).reverse
		if request.post? then
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
				@user.firstname = params[:name]
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

			@video = video
			@comments = comments
			if @video.present?
				@title = @video.name
				@user.clicked.delete(Integer(id))
				@user.clicked.push(Integer(id))
				@user.save
			end
			respond_to do |format|
				format.html { render :layout => false }
				format.json { render :json => @video }
			end

		end
	end

	def looked
		video_id = Integer(params[:id])
		@user.looked.delete(video_id)
		@user.looked.push(video_id)
		@user.save
		render :json => true
	end

	def carousel

	end

	def null_page
		render :layout => false
	end

	def enter
		cookies[:access] = {
						:value=>true,
						:expires => 1.year.from_now
		}
		redirect_to :action=> :video
	end

	def exit
		render :layout => false
	end

	def logout
		cookies.delete(:uid)
		session.delete(:id)
		render :layout => false, :render => false
	end

	def favorite
		result = false
		if request.post? then
			id = params[:id]
			act = params[:act]
			video = Video.where(:id => Integer(id)).count
			if video==1 && session[:id].present? && act=='add'
				user_id = session[:id]
				user = User.find(user_id)
				user.favorites.delete(id)
				user.favorites.push(id)
				user.save
				result = true
			elsif session[:id].present? && act=='del'
				user_id = session[:id]
				user = User.find(user_id)
				user.favorites.delete(id)
				user.save
				result = true
			end
		end
		respond_to do |format|
			format.any { render :json => result }
		end
	end
end