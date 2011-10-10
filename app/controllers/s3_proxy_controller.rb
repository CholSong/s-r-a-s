class S3ProxyController < ApplicationController

  def get_image
    render :text => open("http://s3.amazonaws.com" + request.path, "rb").read
  end

end
