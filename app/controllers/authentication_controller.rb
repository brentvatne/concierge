class AuthenticationController < ApplicationController

  def create
    render json: {text: params.inspect}
  end

end
