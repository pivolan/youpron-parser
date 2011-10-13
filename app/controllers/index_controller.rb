class IndexController < ApplicationController
	layout 'konigi'
	skip_before_filter :can_view, :only => [:null_page, :enter, :exit, :logout]
	skip_before_filter :login, :only => [:null_page, :exit, :logout]

	def null_page
		render :layout => false
	end

	def enter
		cookies[:access] = {
						:value=>true,
						:expires => 1.year.from_now
		}
		redirect_to :controller => :video
	end

	def exit
		render :layout => false
	end

end