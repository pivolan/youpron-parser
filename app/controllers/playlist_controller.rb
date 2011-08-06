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
			@user.playlists.find(params[:id]).push(@video)
		end
	end

	def create_playlist
		if params[:title].present?
			@playlist = Playlist.create(
							:_id => Incrementor[:playlist].inc,
							:title=> params[:title]
			)
			@user.playlists.push(@playlist)
			@user.save!
			render :json => @playlist
		end
	end

	def add_video_to_playlist
		if params[:playlist_id].present? && params[:video_id].present?
			video = Video.find(params[:video_id])
			if video
				@user.playlists.find(params[:playlist_id]).push(video)
				@video = video
			end
		end
	end

	def remove_video_from_playlist
		if params[:playlist_id].present? && params[:video_id].present?
			video = Video.find(params[:video_id])
			if video
				@user.playlists.find(params[:playlist_id]).delete(video)
				@video = video
			end
		end
	end
end