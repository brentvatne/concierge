class PagesController < ApplicationController

  def home
    if current_user.blank?
      @authorization_url = ApiClient.authorization_url(session)
    end
  end

end
