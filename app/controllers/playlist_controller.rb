class PlaylistController < ApplicationController
	skip_before_filter :login, :only => [:short_url_login, :long_url_login]

	def index
		@playlists = @user.playlists.all
	end

	def create_random
		@user.playlists.create(
						{
										:title => 'vasya',
										:description => 'hi, how are you?',
						}
		)
		redirect_to :back
	end

	def add_random_video
		if params[:id].present?
			@video = Video.first
			@user.playlists.find(params[:id])[1] = @video
		end
	end
end