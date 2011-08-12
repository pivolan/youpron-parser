class IndexController < ApplicationController
	layout 'konigi'
	skip_before_filter :can_view, :only => [:null_page, :enter, :exit]

	def index

	end

	def video
		if request.xhr? then
			list = Video.fields(:name, :images, :date, :duration)
			if (params[:category].present?)
				list = list.where(:category_ids.in => params[:category].collect{|x| Integer(x)})
			end
			@list = list.paginate(
							:order => :_id.desc,
							:per_page => 24,
							:page => params[:page]
			)
			@list.each do |video, index|
				@user.seen[String(video._id)] = video._id
			end
			@user.save!
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
				@user.save!
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
				@user.clicked[id] = Integer(id)
				@user.save!
			end
			respond_to do |format|
				format.html { render :layout => false }
				format.json { render :json => @video }
			end

		end
	end

	def carousel

	end

	def null_page
		render :layout => false
	end

	def enter
		@user.access = true
		@user.save!
		redirect_to :action=> :video
	end

	def exit
		render :layout => false
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