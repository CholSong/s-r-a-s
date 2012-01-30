require 'aws/s3'
require 'uuidtools'

class S3ProxyController < ApplicationController
  
  def get_image
    render :text => open("http://s3.amazonaws.com" + request.path, "rb").read
  end

  def upload_temp_image
    s3_config = { :access_key_id => Spree::Config[:access_key_id], :secret_access_key => Spree::Config[:secret_access_key] }
    AWS::S3::Base.establish_connection!(s3_config)
    uuid = UUIDTools::UUID.random_create
    file = params[:'img-upload']
    file_name = "/temp_images/#{uuid}.#{file.original_filename}"
    bucket = Spree::Config[:bucket]
    AWS::S3::S3Object.store(file_name, file, bucket, :content_type => file.content_type, :access => :public_read)
    render :text => "<response><file_path>#{request.protocol}#{request.host_with_port}/#{bucket}#{file_name}</file_path></response>"
  end

end
