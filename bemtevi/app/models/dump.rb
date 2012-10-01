class Dump

  attr_accessor :taxons
  attr_accessor :vendors
  attr_accessor :promotions
  attr_accessor :products

  def self.create_dump (params)
    dump = new Dump
    search_params = {}

    if params[:delta_from].nil?
      search_params[:deleted_at_is_null] = "1"
    else
      search_params[:deleted_at_is_null] = "0"
      search_params[:updated_at_greater_than] = params[:delta_from]
    end

    taxons = Taxon.search(search_params).all
    vendors = Vendor.search(search_params).all

    search_params = search_params.merge :vendor_deleted_at_is_null => "1"

    products = Product.search(search_params).all

    if params[:delta_from].nil?
      search_params[:deactivated_at_is_null] = "1"
    else
      search_params[:deleted_at_is_null] = "0"
    end

    promotions = Promotion.search(search_params).all

    dump.taxons = []
    if !taxons.nil?
      taxons.each { |taxon|
        new_taxon = taxon.deleted_at.nil? ?
          {
            :id => taxon.id,
            :name => taxon.name,
            :parent_id => taxon.parent_id
          } :
          {
            :id => taxon.id,
            :deleted_at => taxon.deleted_at
          }
        dump.taxons << new_taxon
      }
    end

    dump.vendors = []
    if !vendors.nil?
      vendors.each { |vendor|
        new_vendor = vendor.deleted_at.nil? ?
          {
            :id => vendor.id,
            :name => vendor.name,
            :description => vendor.description,
            :latitude => vendor.latitude,
            :longitude => vendor.longitude,
            :taxon_ids => vendor.taxons.find_all { |taxon| !taxon.deleted? }.map { |taxon| taxon.id },
            :vendor_images => vendor.vendor_images.map { |image| { :id => image.id, :type => image.type, :url => image.url } }
          } :
          {
            :id => vendor.id,
            :deleted_at => vendor.deleted_at
          }
        dump.vendors << new_vendor
      }
    end

    dump.promotions = []
    if !promotions.nil?
      promotions.each { |promotion|
        if !promotion.deleted_at.nil?
          dump.promotions << {
            :id => promotion.id,
            :deleted_at => promotion.deleted_at
          }
        elsif !promotion.deactivated_at.nil?
          dump.promotions << {
            :id => promotion.id,
            :deactivated_at => promotion.deactivated_at
          }
        else
          dump.promotions << {
            :id => promotion.id,
            :name => promotion.name,
            :description => promotion.description,
            :expires_at => promotion.expires_at,
            :starts_at => promotion.starts_at,
            :vendor_id => promotion.vendor_id,
            :taxon_ids => promotion.taxons.find_all { |taxon| !taxon.deleted? }.map { |taxon| taxon.id },
            :promotion_images => promotion.promotion_images.map { |image| { :id => image.id, :type => image.type, :url => image.url } },
            :promotion_recurrenceday => promotion.showweekday
          }
        end
      }
    end

    dump.products = []
    if !products.nil?
      products.each { |product|
        new_product = product.deleted_at.nil? ?
          {
            :id => product.id,
            :name => product.name,
            :description => product.description,
            :available_on => product.available_on,
            :vendor_id => product.vendor_id,
            :taxon_ids => product.taxons.find_all { |taxon| !taxon.deleted? }.map { |taxon| taxon.id },
            :images => product.images.map { |image| { :id => image.id, :type => image.type, :url => image.url } }
          } :
          {
            :id => product.id,
            :deleted_at => product.deleted_at
          }
        dump.products << new_product
      }
    end

    return dump
  end

end
