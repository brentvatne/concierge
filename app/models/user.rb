class User < ActiveRecord::Base
  has_secure_password

  # def make_reservation(id)
  #   api_client.reserve(id)
  # end

  def rentals
    api_client.rentals
  end

  def accounts
    api_client.accounts
  end

  private

  def api_client
    @api_client ||= ApiClient.new(oauth_token_secret, oauth_token)
  end
end
