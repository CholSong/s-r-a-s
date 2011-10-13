class Api2::ImagesController < Api::BaseController

  # Skipping is fine as only admin users will have access to the API.
  skip_before_filter :check_http_authorization

  # This should return true only if HTTP_AUTHORIZATION is a valid one.
  def admin_token_passed_in_headers
    request.headers['HTTP_AUTHORIZATION'].present?
  end
  
  # This should check if HTTP authorization is really valid.
  def check_http_authorization
    if request.headers['HTTP_AUTHORIZATION'].blank?
      render :text => "Access Denied\n", :status => 401
    end
  end
  
  private
    def object_serialization_options
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
