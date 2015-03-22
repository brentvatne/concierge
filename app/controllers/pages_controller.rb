class PagesController < ApplicationController

  def home
    if current_user.blank?
      @authorization_url = ApiClient.authorization_url(session)
    else
      @rentals = current_user.rentals
    end
  end

end
