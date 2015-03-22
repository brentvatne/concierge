class AuthenticationController < ApplicationController

  def create
    client = ApiClient.new(session[:oauth_token_secret], session[:oauth_token])
    tokens = client.get_access_tokens(params[:verification_code])
    session[:oauth_token] = tokens[:oauth_token]
    session[:oauth_token_secret] = tokens[:oauth_token_secret]
    # TODO: it can't always be success
    render json: {success: true}
  end

end
