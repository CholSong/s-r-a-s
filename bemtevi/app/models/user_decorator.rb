User.class_eval do
  has_many :taxonomies
  has_many :addresses
  has_many :vendors
  
  attr_accessible :email, :password, :password_confirmation, :name, :addresses, :taxonomies, :remember_me, :persistence_token, :time_zone

  scope :standard_user, lambda { includes(:roles).where("roles.name" => "user") }
  
  def is_admin?
    roles.each { |role|
      return true if role.name == 'admin'
      }
    return false
  end

end