class SessionsController < ApplicationController

  def create
    @user = User.find_by_email(params[:email])

    if @user.authenticate(params[:password])
      session[:current_user_id] = @user.id
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

end
