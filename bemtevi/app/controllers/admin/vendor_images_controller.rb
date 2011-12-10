class Admin::VendorImagesController < Admin::ResourceController
  before_filter :load_data

  create.before :set_viewable
  update.before :set_viewable
  destroy.before :destroy_before

  def update_positions
    params[:positions].each do |id, index|
      VendorImage.update_all(['position=?', index], ['id=?', id])
    end

    respond_to do |format|
      format.js  { render :text => 'Ok' }
    end
  end

  private
  
  def location_after_save
    admin_vendor_vendor_images_url(@vendor)
  end

  def load_data
    @vendor = Vendor.find(params[:vendor_id])
  end

  def set_viewable
    @vendor_image.viewable = @vendor
  end

  def destroy_before
    @viewable = @vendor_image.viewable
  end

end
