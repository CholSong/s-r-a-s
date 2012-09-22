class ImageOverlay < ActiveRecord::Base
  attr_accessible :overlay_images_attributes
	#attr_accessible :overlay_images_attributes
  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :overlay
  has_many :overlay_images, :as => :viewable, :dependent => :destroy

  # Bemtevi TODO
  # add logic to reject_if
  accepts_nested_attributes_for :overlay_images, :allow_destroy => true, 
  	:reject_if => proc{ |attrs| attrs.all? { |k, v| v.blank? }}

end
