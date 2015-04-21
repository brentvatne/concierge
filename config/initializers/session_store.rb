# Be sure to restart your server when you modify this file.

# Rails.application.config.session_store :cookie_store, key: '_concierge_session'
Rails.application.config.session_store ActionDispatch::Session::CacheStore, expire_after: 3.months
