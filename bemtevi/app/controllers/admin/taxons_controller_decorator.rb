Admin::TaxonsController.class_eval do

  def destroy
    deletion_timestamp = Time.now()
    @taxon = Taxon.find(params[:id])

    descendants = Taxon.find_by_id(params[:id]).descendants
    descendants.delete_if{ |descendant| !descendant.deleted_at.nil? }
    deleted_descendants = 0
    descendants.each { |taxon| 
      taxon.products.delete_all unless taxon.products.nil?
      taxon.promotions.delete_all unless taxon.products.nil?
      taxon.vendors.delete_all unless taxon.products.nil?
      taxon.deleted_at = deletion_timestamp
      deleted_descendants += 1 if taxon.save
    }
    
    if deleted_descendants!= descendants.size
      flash.notice = I18n.t("notice_messages.taxon_not_deleted")
      redirect_to edit_admin_taxonomy_url(@taxon.taxonomy)
    else
      @taxon.deleted_at = deletion_timestamp
      @taxon.products.delete_all unless @taxon.products.nil?
      @taxon.promotions.delete_all unless @taxon.products.nil?
      @taxon.vendors.delete_all unless @taxon.products.nil?
      if @taxon.save
        respond_with(@taxon) { |format| format.json { render :json => '' } }
      else
        flash.notice = I18n.t("notice_messages.taxon_not_deleted")
        redirect_to edit_admin_taxonomy_url(@taxon.taxonomy)
      end
    end
  end

  def available
    @product = load_product
    @taxons = params[:q].blank? ? [] : Taxon.where('lower(name) LIKE ?', "%#{params[:q].mb_chars.downcase}%")
    @taxons.delete_if { |taxon| @product.taxons.include?(taxon) || !taxon.deleted_at.nil? }

    respond_with(:admin, @taxons)
  end

  def remove
    @product = load_product
    @taxon = Taxon.find(params[:id])
    @product.taxons.delete(@taxon)
    @product.touch
    @product.save
    @taxons = @product.taxons

    respond_with(@taxon) { |format| format.js { render_js_for_destroy } }
  end

  def select
    @product = load_product
    @taxon = Taxon.find(params[:id])
    @product.taxons << @taxon
    @product.touch
    @product.save
    @taxons = @product.taxons

    respond_with(:admin, @taxons)
  end

  def batch_select
    @product = load_product
    @taxons = params[:taxon_ids].map{|id| Taxon.find(id)}.compact
    @product.taxons = @taxons
    @product.touch
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
