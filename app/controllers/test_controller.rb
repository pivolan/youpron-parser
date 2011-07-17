class TestController < ApplicationController
	before_filter :login

	def index
		@date = Integer(DateTime.strptime('October 3, 2006', "%B %e, %Y"))
	end

	def test2
		@vasya = "kol"
		@niger = "sdfffweweew"
		massive = {'vas'=>'erter', 'kol'=>'$$%%'}
		test = {}
		for key, value in massive
			test[key] = massive[key]
			puts key
			puts massive[key]
			puts value
		end
		@test = test
	end

	def login
		if session[:id].present?
			user = User.find(session[:id])
			puts user
			
		else
			if cookies[:uid].present?
				user = User.where(:cookie_id => cookies[:uid])
				if user.count > 0
					session[:id] = user._id
				end
			else
				new_id = User.new.id
				user = User.create(
								:_id => Incrementor[:user].inc,
								:cookie_id => new_id
				)
				@id = session[:id] = user._id
				cookies[:uid] = new_id
			end
		end
		@users = User.all
		@uid = request.session_options[:id]
		@id = session[:id]
		@uid = session[:session_id]
		cookies[:uid] = 444
		@kas = [1, 5, 6, 8, 7, 9, 3]
	end

	def run

	end

	def get_short_url
		user = User.find(1)
		if user[:short_url].present?
			@short_url = user.short_url
		else
			@short_url = user.generate_short_url
		end
		@user = user
		@id = User.new.id
	end
end