Image.class_eval do

  after_post_process :find_dimensions_and_ratio

  def find_dimensions_and_ratio
    find_dimensions
    self.attachment_aspect_ratio = (self.attachment_width.to_f / self.attachment_height.to_f * 10).round.to_f / 10
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