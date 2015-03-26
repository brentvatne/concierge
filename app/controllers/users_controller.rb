class UsersController < ApplicationController

  def create
    @user = User.create(
      oauth_token_secret: session[:oauth_token_secret],
      oauth_token: session[:oauth_token],
      name: user_params[:name],
      email: user_params[:email],
      phone: user_params[:phone],
      password: user_params[:password],
      password_confirmation: user_params[:password]
    )

    session[:current_user_id] = @user.id
    render json: {success: true, id: @user.id}
  end

  def user_params
    params.require(:user).permit(:name, :email, :phone, :password)
  end
end
