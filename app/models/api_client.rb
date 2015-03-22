class ApiClient
  OAUTH_CONSUMER_KEY = ENV['CAR2GO_CONSUMER_KEY']
  OAUTH_SECRET_KEY = ENV['CAR2GO_SECRET_KEY']
  OAUTH_VERSION = '1.0'
  OAUTH_SIGNATURE_METHOD = 'HMAC-SHA1'

  def self.authorization_url(store = {})
    new.authorization_url(store)
  end

  def initialize(token_secret = nil, token = nil)
    @token_secret = token_secret
    @token = token
  end

  def get_request_token
    post('https://www.car2go.com/api/reqtoken')
  end

  def authorization_url(store = {})
    tokens = Rack::Utils.parse_nested_query(get_request_token.parsed_response).symbolize_keys!
    store[:oauth_token] = tokens[:oauth_token]
    store[:oauth_token_secret] = tokens[:oauth_token_secret]
    "https://www.car2go.com/api/authorize?oauth_token=#{tokens[:oauth_token]}"
  end

  def rentals
    get('https://www.car2go.com/api/v2.1/rentals')
  end

  def accounts
    get('https://www.car2go.com/api/v2.1/accounts')
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

  def auth_headers(url)
    base_auth_headers + ', oauth_signature="' + oauth_signature(url) + '"'
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

  def base_string(url, request_type="GET")
    request_type + '&' + CGI.escape(url) + '&' + CGI.escape(parameters)
  end

  def oauth_signature(url, request_type="GET")
    CGI.escape(Base64.encode64(
      "#{OpenSSL::HMAC.digest('sha1', OAUTH_SECRET_KEY + "&" +
                              oauth_token_secret, base_string(url, request_type))}").chomp)
  end
end
