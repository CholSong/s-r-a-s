class ImageTemplateSet < ActiveRecord::Base

  # Bemtevi TODO
  # Removing this temporarily as it works only in Spree 0.70.x
  # include SubclassRegistration
  
  belongs_to :original_template_set, :class_name => "ImageTemplateSet"
  belongs_to :promotion
  belongs_to :vendor
  has_many :image_templates, :dependent => :destroy

  # Bemtevi TODO
  # add logic to reject_if
  accepts_nested_attributes_for :image_templates, :allow_destroy => true

end
