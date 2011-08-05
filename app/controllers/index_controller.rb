class IndexController < ApplicationController
	layout 'konigi'
	skip_before_filter :can_view, :only => [:null_page, :enter, :exit]

	def index

	end

	def video
		@list = Video.fields(:name, :images, :date, :duration).paginate(
						:order => :_id.desc,
						:per_page => 24,
						:page => params[:page]
		)
		respond_to do |format|
			format.any
			format.json { render :json => @list }
		end
	end

	def view
		id = params[:id]
		video = Video.find(Integer(id))
		comments = video.comments.sort_by(&:published).reverse

		if !params[:name].blank? && !params[:message].blank? then
			comment = Comment.new(
							:name => params[:name],
							:message => params[:message],
							:published => Time.current
			)
			video.comments.push(comment)
			video.save
			#video.reload
			redirect_to :back
		end
		@video = video
		@comments = comments
		if @video.present?
			@title = @video.name
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
end