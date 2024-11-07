import React, { useState } from 'react';

interface CharacterInfoProps {
  initialInfo: CharacterInfoState;
  onInfoChange: (info: CharacterInfoState) => void;
}

interface CharacterInfoState {
  name: string;
  age: string;
  height: string;
  weight: string;
  mother: string;
  motherJob: string;
  father: string;
  fatherJob: string;
  siblings: string;
  significantOther1: string;
  significantOther2: string;
}

const CharacterInfo: React.FC<CharacterInfoProps> = ({ initialInfo, onInfoChange }) => {
  const [info, setInfo] = useState<CharacterInfoState>(initialInfo);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInfoChange(info);
    setIsEditing(false);
  };

  const inputStyle = "w-full p-1 bg-white text-gray-800 border border-gray-300 rounded";

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="bg-gray-200 p-2 space-y-2 text-xs">
        <div className="flex space-x-2">
          <input name="name" value={info.name} onChange={handleChange} placeholder="Name" className={`flex-grow ${inputStyle}`} />
          <input name="age" value={info.age} onChange={handleChange} placeholder="Age" className={`w-16 ${inputStyle}`} />
          <input name="height" value={info.height} onChange={handleChange} placeholder="Height" className={`w-20 ${inputStyle}`} />
          <input name="weight" value={info.weight} onChange={handleChange} placeholder="Weight" className={`w-20 ${inputStyle}`} />
        </div>
        <input name="mother" value={info.mother} onChange={handleChange} placeholder="Mother" className={inputStyle} />
        <input name="motherJob" value={info.motherJob} onChange={handleChange} placeholder="Mother's Job" className={inputStyle} />
        <input name="father" value={info.father} onChange={handleChange} placeholder="Father" className={inputStyle} />
        <input name="fatherJob" value={info.fatherJob} onChange={handleChange} placeholder="Father's Job" className={inputStyle} />
        <input name="siblings" value={info.siblings} onChange={handleChange} placeholder="Siblings" className={inputStyle} />
        <input name="significantOther1" value={info.significantOther1} onChange={handleChange} placeholder="Significant Other 1" className={inputStyle} />
        <input name="significantOther2" value={info.significantOther2} onChange={handleChange} placeholder="Significant Other 2" className={inputStyle} />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Save</button>
      </form>
    );
  }

  return (
    <div className="bg-gray-200 p-2 space-y-1 text-xs">
      <div className="flex justify-between">
        <span className="font-bold">{info.name}</span>
        <span>{info.age} years | {info.height} | {info.weight}</span>
      </div>
      <div>Mother: {info.mother} ({info.motherJob})</div>
      <div>Father: {info.father} ({info.fatherJob})</div>
      <div>Siblings: {info.siblings}</div>
      <div>Significant Other: {info.significantOther1}</div>
      <div>{info.significantOther2}</div>
      <button onClick={() => setIsEditing(true)} className="bg-gray-400 px-2 py-1 rounded hover:bg-gray-500 text-gray-800">Edit</button>
    </div>
  );
};

export default CharacterInfo;