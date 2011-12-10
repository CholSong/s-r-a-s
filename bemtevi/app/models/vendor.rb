class Vendor < ActiveRecord::Base

  belongs_to :address
  has_many :vendor_images, :as => :viewable, :order => :position, :dependent => :destroy

  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def deleted?
    !!deleted_at
  end

end