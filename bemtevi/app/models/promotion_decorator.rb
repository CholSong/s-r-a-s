Promotion.class_eval do

  has_many :promotion_images, :as => :viewable, :order => :position, :dependent => :destroy
  has_one :image_template_set, :dependent => :destroy
  
  has_and_belongs_to_many :taxons
  belongs_to :vendor

  accepts_nested_attributes_for :promotion_images, :image_template_set

  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def deleted?
    !!deleted_at
  end

  def taxon_ids
    taxon_ids = []
    taxons.each { |taxon| taxon_ids << taxon.id if !taxon.deleted? }
    taxon_ids
  end

  def deactivated?
    !!deactivated_at
    expires_at < Time.now
  end

  def active?
    !deactivated?
  end

  def activate
    update_attribute(:deactivated_at, nil)
  end

  def deactivate
    update_attribute(:deactivated_at, Time.now)
  end

end