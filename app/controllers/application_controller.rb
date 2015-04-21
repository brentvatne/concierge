class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception

  # Disable the root node, eg: {projects: [{..}, {..}]}
  def default_serializer_options
    {root: false}
  end

  def current_user
    return nil if session[:current_user_id].nil?
    @current_user ||= begin
      user = User.find_by_id(session[:current_user_id])

      # Clear it if no user was found with that id
      if user.nil?
        session[:current_user_id] = nil
      end

      user
    end
  end
  helper_method :current_user

  before_filter :deep_snake_case_params!
  def deep_snake_case_params!(val = params)
    case val
    when Array
      val.map {|v| deep_snake_case_params! v }
    when Hash
      val.keys.each do |k, v = val[k]|
        val.delete k
        val[k.underscore] = deep_snake_case_params!(v)
      end
      val
    else
      val
    end
  end
end
