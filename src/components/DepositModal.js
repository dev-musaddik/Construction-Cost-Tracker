import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

// Get today in YYYY-MM-DD format (adjusted for timezone)
const todayStr = () => {
  const now = new Date();
  const tz = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tz).toISOString().slice(0, 10);
};

// Format any date string into YYYY-MM-DD for <input type="date">
const formatDateForInput = (dateStr) => {
  if (!dateStr) return todayStr();
  const d = new Date(dateStr);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
};

const DepositModal = ({ isOpen, onClose, onSave, deposit }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayStr()); // default to today

  useEffect(() => {
    if (deposit) {
      setDescription(deposit.description ?? '');
      setAmount(
        deposit.amount !== undefined && deposit.amount !== null
          ? String(deposit.amount)
          : ''
      );
      setDate(formatDateForInput(deposit.date));
    } else {
      setDescription('');
      setAmount('');
      setDate(todayStr()); // reset to today when adding new
    }
  }, [deposit, isOpen]);

  const handleSave = () => {
    if (!description || !amount) {
      toast.error(t('pleaseFillInAllFields'));
      return;
    }

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error(t('pleaseEnterAValidAmount'));
      return;
    }

    onSave({
      ...(deposit || {}),
      description,
      amount: amountNum,
      date: date || todayStr(), // ensure date is never empty
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{deposit ? t('editDeposit') : t('addDeposit')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="col-span-3"
          />
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('description')}
            className="col-span-3"
          />
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('amount')}
            className="col-span-3"
          />
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} variant="outline">
            {t('cancel')}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
