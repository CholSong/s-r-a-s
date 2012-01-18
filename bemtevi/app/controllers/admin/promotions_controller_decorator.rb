Admin::PromotionsController.class_eval do
  
  # override the destory method to set deleted_at value
  # instead of actually deleting the product.
  def destroy
    @promotion = Promotion.find(params[:id])
    @promotion.deleted_at = Time.now()

    if @promotion.save
      flash.notice = I18n.t("notice_messages.promotion_deleted")
    else
      flash.notice = I18n.t("notice_messages.promotion_not_deleted")
    end

    respond_with(@promotion) do |format|
      format.html { redirect_to collection_url }
      format.js  { render_js_for_destroy }
    end  
  end

  protected 

  def location_after_save
    admin_promotion_promotion_images_url(@promotion)
  end
  
  def collection
    return @collection if @collection.present?

    unless request.xhr?
      params[:search] ||= {}
      # Note: the MetaSearch scopes are on/off switches, so we need to select "not_deleted" explicitly if the switch is off
      if params[:search][:deleted_at_is_null].nil?
        params[:search][:deleted_at_is_null] = "1"
      end

      params[:search][:meta_sort] ||= "name.asc"
      @search = super.metasearch(params[:search])

      pagination_options = {:per_page  => Spree::Config[:admin_products_per_page],
                            :page      => params[:page]}

      @collection = @search.paginate(pagination_options)
    else
      @collection = super.where(["name #{LIKE} ?", "%#{params[:q]}%"])
      @collection = @collection.limit(params[:limit] || 10)
    end

  end

end
