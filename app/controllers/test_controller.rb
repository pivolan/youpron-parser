class TestController < ApplicationController
	skip_before_filter :login, :only => [:short_url_login]

	def index
		@date = Integer(DateTime.strptime('October 3, 2006', "%B %e, %Y"))
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

	def login
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
		end
		@user.save!
	end

	def test2
		@vasya = "kol"
		@niger = "sdfffweweew"
		massive = {'vas'=>'erter', 'kol'=>'$$%%'}
		test = {}
		nix = []
		for key, value in massive
			test[key] = massive[key]
			puts key
			puts massive[key]
			puts value
		end
		@test = test
	end
end