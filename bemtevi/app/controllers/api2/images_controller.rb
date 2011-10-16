class Api2::ImagesController < Api::BaseController

  # Skipping is fine as only admin users will have access to the API.
  skip_before_filter :check_http_authorization

  # This should return true only if HTTP_AUTHORIZATION is a valid one.
  # Consider adding this to a super class in between Api::BaseController and the actual API controllers.
  def admin_token_passed_in_headers
    request.headers['HTTP_AUTHORIZATION'].present?
  end
  
  # This should check if HTTP authorization is really valid.
  # Consider adding this to a super class in between Api::BaseController and the actual API controllers.
  def check_http_authorization
    if request.headers['HTTP_AUTHORIZATION'].blank?
      render :text => "Access Denied\n", :status => 401
    end
  end
  
  # This is overriding an Api::BaseController method, so that the proper url is passed to send invokation.
  # Consider adding this to a super class in between Api::BaseController and the actual API controllers.
  def object_url(object = nil, options = {})
    target = object ? object : @object
    send "api2_#{object_name}_url", target, options
  end
  
  private
    def object_serialization_options
      { :only => [:id],
        :methods => [:url]
      }
    end
    
    def collection_serialization_options
      object_serialization_options
    end

end
