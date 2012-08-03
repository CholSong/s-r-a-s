class PromotionImage < Asset
  
  validate :no_attachement_errors
  belongs_to :promotion, :foreign_key => :viewable_id, :touch => true
  has_attached_file :attachment,
                    :styles => { :mini => '48x48>', :small => '100x100>', :medium => '240x240>', :large => '600x600>' },
                    :default_style => :product,
                    :url => "/assets/promotions/:id/:style/:basename.:id.:extension",
                    :path => ":rails_root/public/assets/promotions/:id/:style/:basename.:id.:extension"

  # save the w,h of the original image (from which others can be calculated)
  # we need to look at the write-queue for images which have not been saved yet
  after_post_process :find_dimensions

  def find_dimensions
    temporary = attachment.queued_for_write[:original]
    filename = temporary.path unless temporary.nil?
    filename = attachment.path if filename.blank?
    geometry = Paperclip::Geometry.from_file(filename)
    self.attachment_width  = geometry.width
    self.attachment_height = geometry.height
    self.attachment_aspect_ratio = (self.attachment_width.to_f / self.attachment_height.to_f * 10).round.to_f / 10
  end

  # if there are errors from the plugin, then add a more meaningful message
  def no_attachement_errors
    unless attachment.errors.empty?
      # uncomment this to get rid of the less-than-useful interrim messages
      # errors.clear
      errors.add :attachment, "Paperclip returned errors for file '#{attachment_file_name}' - check ImageMagick installation or image source file."
      false
    end
  end
  
  def type
    return "unknown" if self.attachment_aspect_ratio.nil?
    return "summary" if self.attachment_aspect_ratio > 1
    "detail"
  end

  def url
    attachment.url(:original)
  end

end