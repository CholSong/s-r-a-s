Admin::TaxonomiesController.class_eval do
  def get_children
    @taxons = Taxon.find(params[:parent_id]).children
    @taxons.delete_if { |taxon| taxon.deleted? }

    respond_with(@taxons)
  end

  def destroy
    deletion_timestamp = Time.now()
    taxonomy = Taxonomy.find(params[:id])

    descendants = taxonomy.taxons
    descendants.delete_if { |descendant| descendant.deleted? }
    deleted_descendants = 0
    descendants.each { |taxon|
      if touch_taxon_relations(taxon)
        taxon.deleted_at = deletion_timestamp
        deleted_descendants += 1 if taxon.save
      end
    }

    success = deleted_descendants == descendants.size
    if success
      taxonomy.deleted_at = deletion_timestamp
      success &&= taxonomy.save
    end

    flash.notice = success ? I18n.t("notice_messages.taxonomy_deleted") :
        I18n.t("notice_messages.taxonomy_not_deleted")

    respond_with(taxonomy) do |format|
      format.html { redirect_to collection_url }
      format.js  { render_js_for_destroy }
    end
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
      includes = []

      @collection = super.where(["name #{LIKE} ?", "%#{params[:q]}%"])
      @collection = @collection.includes(includes).limit(params[:limit] || 10)

    @collection.uniq
    end

  end

  private

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
