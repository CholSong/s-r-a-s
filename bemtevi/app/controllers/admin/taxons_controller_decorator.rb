Admin::TaxonsController.class_eval do
  def destroy
    deletion_timestamp = Time.now()
    @taxon = Taxon.find(params[:id])

    descendants = Taxon.find_by_id(params[:id]).descendants
    descendants.delete_if{ |descendant| descendant.deleted? }
    deleted_descendants = 0
    descendants.each { |taxon|
      if touch_taxon_relations(taxon)
        taxon.deleted_at = deletion_timestamp
        deleted_descendants += 1 if taxon.save
      end
    }

    success = deleted_descendants == descendants.size
    if success
      success &&= touch_taxon_relations(@taxon)
      if success
        @taxon.deleted_at = deletion_timestamp
        success &&= @taxon.save
      end
    end
    
    if success
      respond_with(@taxon) { |format| format.json { render :json => '' } }
    else
      flash.notice = I18n.t("notice_messages.taxon_not_deleted")
      redirect_to edit_admin_taxonomy_url(@taxon.taxonomy)
    end
  end

  def selected
    @product = load_product
    @taxons = @product.taxons
    @taxons.delete_if { |taxon| taxon.deleted? }

    respond_with(:admin, @taxons)
  end

  def available
    @product = load_product
    @taxons = params[:q].blank? ? [] : Taxon.where('lower(name) LIKE ?', "%#{params[:q].mb_chars.downcase}%")
    @taxons.delete_if { |taxon| @product.taxons.include?(taxon) || taxon.deleted? }

    respond_with(:admin, @taxons)
  end

  def remove
    @product = load_product
    @taxon = Taxon.find(params[:id])
    @product.taxons.delete(@taxon)
    @product.touch
    @product.save
    @taxons = @product.taxons
    @taxons.delete_if { |taxon| taxon.deleted? }

    respond_with(@taxon) { |format| format.js { render_js_for_destroy } }
  end

  def select
    @product = load_product
    @taxon = Taxon.find(params[:id])
    @product.taxons << @taxon
    @product.touch
    @product.save
    @taxons = @product.taxons
    @taxons.delete_if { |taxon| taxon.deleted? }

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

  def touch_taxon_relations (taxon)
    success = true
    if !taxon.products.nil?
      taxon.products.each { |product|
        if !product.deleted?
          product.touch
          success &&= product.save
        end
      }
    end
    if !taxon.promotions.nil?
      taxon.promotions.each { |promotion|
        if !promotion.deleted?
          promotion.touch
          success &&= promotion.save
        end
      }
    end
    if !taxon.vendors.nil?
      taxon.vendors.each { |vendor|
        if !vendor.deleted?
          vendor.touch
          success &&= vendor.save
        end
      }
    end
    return success
  end

end
