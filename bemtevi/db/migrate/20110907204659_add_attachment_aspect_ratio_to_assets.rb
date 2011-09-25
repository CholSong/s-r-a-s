class AddAttachmentAspectRatioToAssets < ActiveRecord::Migration
  def self.up
    add_column :assets, :attachment_aspect_ratio, :decimal
  end

  def self.down
    remove_column :assets, :attachment_aspect_ratio
  end
end
