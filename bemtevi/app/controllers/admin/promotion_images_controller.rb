class Admin::PromotionImagesController < Admin::ResourceController
  before_filter :load_data

  create.before :set_viewable
  update.before :set_viewable
  destroy.before :destroy_before

  def update_positions
    params[:positions].each do |id, index|
      PromotionImage.update_all(['position=?', index], ['id=?', id])
    end

    respond_to do |format|
      format.js  { render :text => 'Ok' }
    end
  end

  private
  
  def location_after_save
    admin_promotion_promotion_images_url(@promotion)
  end

  def load_data
    @promotion = Promotion.find(params[:promotion_id])
  end

  def set_viewable
    @promotion_image.viewable = @promotion
  end

  def destroy_before
    @viewable = @promotion_image.viewable
  end

end
