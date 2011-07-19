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
end