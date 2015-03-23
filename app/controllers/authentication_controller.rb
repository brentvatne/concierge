class AuthenticationController < ApplicationController

  def new
    @authorization_url = ApiClient.authorization_url(session)
  end

  def create
    client = ApiClient.new(session[:oauth_token_secret], session[:oauth_token])
    tokens = client.get_access_tokens(params[:verification_code])

    if tokens[:oauth_token].present? && tokens[:oauth_token_secret].present?
      session[:oauth_token] = tokens[:oauth_token]
      session[:oauth_token_secret] = tokens[:oauth_token_secret]
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

end
