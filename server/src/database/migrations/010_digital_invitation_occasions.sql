-- Expand digital_surprises occasions for Digital Invitation product
ALTER TABLE digital_surprises
  DROP CONSTRAINT IF EXISTS digital_surprises_occasion_check;

ALTER TABLE digital_surprises
  ADD CONSTRAINT digital_surprises_occasion_check
  CHECK (
    occasion IN (
      'girlfriends_day',
      'birthday',
      'diwali',
      'wedding',
      'birthday_party',
      'housewarming',
      'baby_shower'
    )
  );
