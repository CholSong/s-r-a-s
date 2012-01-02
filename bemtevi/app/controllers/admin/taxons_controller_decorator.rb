Admin::TaxonsController.class_eval do

  def batch_select
    @product = load_product
    @taxons = params[:taxon_ids].map{|id| Taxon.find(id)}.compact
    @product.taxons = @taxons
    @product.save

    if !@promotion.nil? redirect_to selected_admin_promotion_taxons_url(@promotion)
    elsif !@vendor.nil? redirect_to selected_admin_vendor_taxons_url(@vendor)
    else redirect_to selected_admin_product_taxons_url(@product)
    end
  end

  private
  
  def load_product
    # Bemtevi
    # @product is still used as the reference to promotion and vendor to minimize the amount of code
    # that needs to be overriden.
    #
    if !params[:product_id].nil?
      @product = Product.find_by_permalink! params[:product_id]
    elsif !params[:promotion_id].nil?
      @promotion = Promotion.find(params[:promotion_id])
      @product = @promotion
    elsif !params[:vendor_id].nil?
      @vendor = Vendor.find(params[:vendor_id])
      @product = @vendor
    end
    return @product
  end

end
