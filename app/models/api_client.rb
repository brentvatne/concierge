# TODO: Should have retries
class ApiClient
  OAUTH_CONSUMER_KEY = ENV['CAR2GO_CONSUMER_KEY']
  OAUTH_SECRET_KEY = ENV['CAR2GO_SECRET_KEY']
  OAUTH_VERSION = '1.0'
  OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1'

  def self.available_cars(loc = 'vancouver')
    url = "http://www.car2go.com/api/v2.1/vehicles?loc=#{loc}&oauth_consumer_key=#{OAUTH_CONSUMER_KEY}&format=json"
    HTTParty.get(url).parsed_response['placemarks']
  end

  def self.authorization_url(store = {})
    new.authorization_url(store)
  end

  def initialize(token_secret = nil, token = nil)
    @token_secret = token_secret
    @token = token
  end

  # Returns {oauth_token: '...', oauth_token_secret: '...'}
  # which can be used to generate an authorization URL
  #
  def get_request_tokens
    response = post('https://www.car2go.com/api/reqtoken').parsed_response
    Rack::Utils.parse_nested_query(response).symbolize_keys!
  end

  # Returns {oauth_token: '...', oauth_token_secret: '...'}
  # which can be used for user-specific API requests
  #
  def get_access_tokens(verification_code)
    @verifier = verification_code
    url = 'https://www.car2go.com/api/accesstoken'
    headers = {'Authorization' => auth_headers(url, :for_authentication)}
    response = HTTParty.post(url, headers: headers).parsed_response
    Rack::Utils.parse_nested_query(response).symbolize_keys!
  end

  def authorization_url(store = {})
    tokens = get_request_tokens
    store[:oauth_token] = tokens[:oauth_token]
    store[:oauth_token_secret] = tokens[:oauth_token_secret]
    "https://www.car2go.com/api/authorize?oauth_token=#{tokens[:oauth_token]}"
  end

  # TODO: Need to handle error cases!
  # http://url.brentvatne.ca/12FjM
  #
  def create_booking(vin, account)
    url = 'https://www.car2go.com/api/v2.1/bookings'
    response = HTTParty.post(
      url + "?format=json&loc=vancouver&vin=#{vin}&account=#{account}",
     headers: {'Authorization' => auth_headers(url, :create_booking, vin: vin, account: account)}
    )

    response = response.parsed_response['booking'].first

    {address: response['bookingposition']['address'],
     time: Time.at(response['reservationTime']['timeInMillis']),
     license_plate: response['name'] }
  end

  def rentals
    get('https://www.car2go.com/api/v2.1/rentals')['rentals']
  end

  def accounts
    get('https://www.car2go.com/api/v2.1/accounts').parsed_response['account']
  end

  private

  def get(url)
    HTTParty.get(url + "?format=json&loc=vancouver",
                 headers: {'Authorization' => auth_headers(url)})
  end

  def post(url)
    HTTParty.get(url + "?format=json&loc=vancouver",
                 headers: {'Authorization' => auth_headers(url)})
  end

  def oauth_timestamp
    @oauth_timestamp ||= Time.now.to_i.to_s
  end

  def oauth_nonce
    @oauth_nonce ||= Random.rand(100000).to_s
  end

  def oauth_token
    @token || ''
  end

  def oauth_token_secret
    @token_secret || ''
  end

  def base_auth_headers
    'OAuth oauth_signature_method="HMAC-SHA1", ' +
    'oauth_consumer_key="' + OAUTH_CONSUMER_KEY + '", ' +
    'oauth_version="1.0", ' +
    'oauth_timestamp="' + oauth_timestamp  + '", ' +
    'oauth_nonce="' + oauth_nonce  + '", ' +
    'oauth_callback="oob", ' +
    'oauth_token="' + oauth_token  + '"'
  end

  def base_auth_headers_with_verifier
    base_auth_headers + ', ' +
    'oauth_verifier="' + @verifier + '"'
  end

  def parameters
    'format=json' +
    '&loc=vancouver' +
    '&oauth_callback=' +
    'oob' +
    '&oauth_consumer_key=' +
    OAUTH_CONSUMER_KEY +
    '&oauth_nonce=' +
    oauth_nonce +
    '&oauth_signature_method=' +
    OAUTH_SIGNATURE_METHOD +
    '&oauth_timestamp=' +
    oauth_timestamp +
    '&oauth_token=' +
    oauth_token +
    '&oauth_version=' +
    OAUTH_VERSION
  end

  def parameters_for_booking(vin, account)
    'account=' + account.to_s +
    '&format=json' +
    '&loc=vancouver' +
    '&oauth_callback=' +
    'oob' +
    '&oauth_consumer_key=' +
    OAUTH_CONSUMER_KEY +
    '&oauth_nonce=' +
    oauth_nonce +
    '&oauth_signature_method=' +
    OAUTH_SIGNATURE_METHOD +
    '&oauth_timestamp=' +
    oauth_timestamp +
    '&oauth_token=' +
    oauth_token +
    '&oauth_version=' +
    OAUTH_VERSION +
    '&vin=' +
    vin
  end

  def auth_parameters
    'oauth_callback=' +
    'oob' +
    '&oauth_consumer_key=' +
    OAUTH_CONSUMER_KEY +
    '&oauth_nonce=' +
    oauth_nonce +
    '&oauth_signature_method=' +
    OAUTH_SIGNATURE_METHOD +
    '&oauth_timestamp=' +
    oauth_timestamp +
    '&oauth_token=' +
    oauth_token +
    '&oauth_verifier=' +
    @verifier +
    '&oauth_version=' +
    OAUTH_VERSION
  end

  def auth_headers(url, type = :normal, options = {})
    signature = nil
    headers = nil

    if type == :for_authentication
      signature = oauth_signature(url, 'POST', auth_parameters)
      headers = base_auth_headers_with_verifier
    elsif type == :create_booking
      signature = oauth_signature(url, 'POST',
                                  parameters_for_booking(options[:vin], options[:account]))
      headers = base_auth_headers
    else
      signature = oauth_signature(url)
      headers = base_auth_headers
    end

    headers + ', oauth_signature="' + signature  + '"'
  end

  def base_string(url, request_type="GET", params = parameters)
    request_type + '&' + CGI.escape(url) + '&' + CGI.escape(params)
  end

  def oauth_signature(url, request_type="GET", params = parameters)
    CGI.escape(Base64.encode64(
      "#{OpenSSL::HMAC.digest('sha1', OAUTH_SECRET_KEY + "&" +
                              oauth_token_secret, base_string(url, request_type, params))}").chomp)
  end
end
