class IndexController < ApplicationController
	layout 'konigi'

	def index

	end
	def login

	end

	def video
		@list = Video.fields(:name, :images, :date, :duration).paginate(
						:order			=>	:_id.desc,
						:per_page   =>	24,
						:page				=>  params[:page]
		)
	end

	def view
		id = params[:id]
		@video = Video.find(Integer(id))
		if @video.present?
			@title = @video.name
		end
	end

end