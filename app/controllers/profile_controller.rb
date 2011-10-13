class ProfileController < ApplicationController
	skip_before_filter :login, :only => [:short_url_login, :long_url_login]
	skip_before_filter :can_view, :only => [:short_url_login, :long_url_login]

	def index
		
	end

	def all
		@users = User.all
	end

	def short_url_login
		if params[:short_url].present?
			users = User.where(:short_url => params[:short_url]).all
			@users = users
			if users.count == 1
				session[:id] = users[0]._id
				cookies[:uid] = {
								:value=>users[0].cookie_id,
								:expires => 1.year.from_now
				}
			end
		end
		login
	end

	def long_url_login
		if params[:url].present?
			users = User.where(:cookie_id => params[:url]).all
			@users = users
			if users.count == 1
				session[:id] = users[0]._id
				cookies[:uid] = {
								:value=>users[0].cookie_id,
								:expires => 1.year.from_now
				}
			end
		end
		login
	end

	def get_short_url
		if @user[:short_url].present?
			@short_url = @user.short_url
		else
			@short_url = @user.generate_short_url
			@user.save!
			redirect_to :back			
		end
	end

	def delete_short_url
		@user.short_url = nil
		@user.save!
		redirect_to :back
	end

	def clear_seen_list
		@user.seen = []
		@user.save!
		redirect_to :action => :index
	end

	def clear_clicked_list
		@user.clicked = []
		@user.save!
		redirect_to :action => :index
	end

	def nick
		if params[:nick] != nil
			@user.nick = params[:nick]
			@user.save!
		end
		render :json => @user
	end

	def logout
		cookies.delete(:uid)
		session.delete(:id)
		render :layout => false, :render => false
	end

end