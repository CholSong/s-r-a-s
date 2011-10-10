class RenameImageIdToImageTemplateIdOnImageOverlays < ActiveRecord::Migration
  def self.up
    add_column :image_overlays, :image_template_id, :integer
    remove_column :image_overlays, :image_id
  end

  def self.down
    remove_column :image_overlays, :image_template_id
    add_column :image_overlays, :image_id, :integer
  end
end
