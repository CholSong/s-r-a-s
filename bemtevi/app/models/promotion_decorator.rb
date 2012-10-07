Promotion.class_eval do
  attr_accessible :name, :event_name, :code, :match_policy,
                  :path, :advertise, :description, :usage_limit,
                  :starts_at, :expires_at, :promotion_rules_attributes,
                  :promotion_actions_attributes, :is_test, :promotion_images_attributes,
                  :image_template_set_attributes, :promotion_recurrenceday_attributes, :taxons_attributes
  has_many :promotion_images, :as => :viewable, :order => :position, :dependent => :destroy
  has_one :image_template_set, :dependent => :destroy
  has_one :promotion_recurrenceday, :dependent => :destroy
  has_and_belongs_to_many :taxons
  belongs_to :vendor

  accepts_nested_attributes_for :promotion_images, :image_template_set, :promotion_recurrenceday
  
  @@weekdays = ["sun","mon","tue","wed","thu","fri", "sat"]
  #@@weekdays = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira", "sábado"]
  # use deleted? rather than checking the attribute directly. this
  # allows extensions to override deleted? if they want to provide
  # their own definition.
  def weekdays
    @@weekdays
  end
  def deleted?
    !!deleted_at
  end

  def taxon_ids
    taxon_ids = []
    taxons.each { |taxon| taxon_ids << taxon.id if !taxon.deleted? }
    taxon_ids
  end

  def deactivated?
    weekdays = is_recurrence
    if weekdays != false
      weekdays = weekdays.split(',')
      today = @@weekdays[Time.now.wday]
      is_today = weekdays.include? today
      !!deactivated_at || !is_today || expires_at < Time.now
    else
      !!deactivated_at || expires_at < Time.now
    end
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

  def is_recurrence
    if(promotion_recurrenceday)
      PromotionRecurrenceday.find(promotion_recurrenceday).day
    else
      false
    end
  end
  
  def showweekday
    weekdays = is_recurrence
    return_val = nil
    if weekdays != false
      return_val = weekdays.split(',')
    end
    return_val
  end
end