Admin::TaxonomiesController.class_eval do

  def get_children
    @taxons = Taxon.find(params[:parent_id]).children
    @taxons.delete_if { |taxon| !taxon.deleted_at.nil? }

    respond_with(@taxons)
  end
  
  def destroy
    deletion_timestamp = Time.now()
    taxonomy = Taxonomy.find(params[:id])

    descendants = taxonomy.taxons
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
      flash.notice = I18n.t("notice_messages.taxonomy_not_deleted")
    else
      taxonomy.deleted_at = deletion_timestamp
      if taxonomy.save
        flash.notice = I18n.t("notice_messages.taxonomy_deleted")
      else
        flash.notice = I18n.t("notice_messages.taxonomy_not_deleted")
      end
    end
    
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


end
