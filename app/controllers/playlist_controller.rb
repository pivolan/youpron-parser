class PlaylistController < ApplicationController
	skip_before_filter :login, :only => [:short_url_login, :long_url_login]

	def index
		@playlists = @user.playlist.all
	end

	def create
		if params[:title].present?

			@playlist = Playlist.create(
							:_id => Incrementor[:playlist].inc,
							:title=> params[:title]
			)
			@user.playlist.push(@playlist)
			@user.current_playlist = @playlist._id
			@user.save!
			render :json => {
							:id => @playlist._id,
							:title => @playlist.title,
							:href_view => url_for(:action => :view, :id=>@playlist._id),
							:status => true
			}
		end
	end

	def delete
		if params[:id]
			id = Integer(params[:id])
			Playlist.destroy(id)
		end
		redirect_to :back
	end

	def view
		id = Integer(params[:id])
		@playlist = Playlist.find(id)
		respond_to do |format|
			format.html
			format.json { render :json => @playlist.to_json(:include => :video) }
		end
	end

	def select
		id = Integer(params[:id])
		@user.current_playlist = id
		@playlist = Playlist.find(id)
		@user.save!
		respond_to do |format|
			format.html
			format.json { render :json => @playlist.to_json(:include => :video) }
		end
	end

	def select_favorite
		video_ids = @user.favorites.collect { |x| Integer(x) }
		@videos = Video.find(video_ids)
		respond_to do |format|
			format.html
			format.json { render :json => {'video'=> @videos} }
		end
	end

	def add_video
		if params[:video_id].present? && params[:playlist_id].present?
			video_id = Integer(params[:video_id])
			video = Video.find(video_id)
			if video
				playlist_id = Integer(params[:playlist_id])
				playlist = @user.playlist.find(playlist_id)
				if playlist
					playlist.video.push(video)
				end
				@video = video
			end
		end
		respond_to do |format|
			format.html { render :html => @video.to_json }
			format.json { render :json => @video }
		end
	end

	def remove_video
		playlist_id = Integer(params[:playlist_id])
		if playlist_id.present? && params[:video_id].present?
			video_id = Integer(params[:video_id])
			video = Video.find(video_id)
			if video
				@user.playlist.find(playlist_id).video.delete(video_id)
				@video = video
			end
		end
		respond_to do |format|
			format.json { render :json => @video }
		end
	end
end