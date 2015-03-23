class User < ActiveRecord::Base
  has_secure_password
  has_many :bookings
  validates :email, uniqueness: true

  def rentals
    @rentals ||= api_client.rentals.map { |rental|
      Rental.new(rental)
    }
  end

  def accounts
    @accounts ||= api_client.accounts
  end

  def account_id
    @account_id ||= accounts.first['accountId']
  end

  def create_booking(vin)
    if response = api_client.create_booking(vin, account_id)
      response
    else
      nil
    end
  end

  private

  def api_client
    @api_client ||= ApiClient.new(oauth_token_secret, oauth_token)
  end

  class Rental
    def initialize(raw_data)
      @raw_data = raw_data
    end

    def to_s
      "#{cost} - #{start_time}"
    end

    def inspect
      to_s
    end

    def cost
      "$#{@raw_data['driveAmount']['amountGross']} #{@raw_data['driveAmount']['currency']}"
    end

    def duration
      @raw_data['driveDurationInMinutes']
    end

    def start_location
      @raw_data['usageStartAddress']
    end

    def end_location
      @raw_data['usageEndAddress']
    end

    def start_time
      time = @raw_data['usageStartTime']['timeInMillis']
      if time.present?
        Time.at(time / 1000)
      end
    end

    def end_time
      time = @raw_data['usageEndTime']['timeInMillis']
      if time.present?
        Time.at(time / 1000)
      end
    end
  end
end
