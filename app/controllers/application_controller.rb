class ApplicationController < ActionController::Base
	layout 'konigi'
	protect_from_forgery
	before_filter :login

	def login
		if session[:id].present?
			user = User.find(session[:id])
			if user != nil
			else
				session[:id] = nil
			end
		end
		if !session[:id].present?
			if cookies[:uid].present?
				users = User.where(:cookie_id => cookies[:uid]).all
				if users.count == 1
					session[:id] = users[0]._id
					session[:from] = 'cookie'
					cookies[:uid] = {
									:value=>cookies[:uid],
									:expires => 1.year.from_now
					}
				else
					cookies.delete(:uid)
					session[:id] = nil
				end
			else
				new_id = User.generate_cookie_id
				user = User.create(
								:_id => Incrementor[:user].inc,
								:cookie_id => new_id
				)
				@id = session[:id] = user._id
				cookies[:uid] = {
								:value=>new_id,
								:expires => 1.year.from_now
				}
				session[:from] = 'new generated'
			end
		end
		@user = user
	end
end
